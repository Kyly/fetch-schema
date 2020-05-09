import {getIntrospectionQuery, buildClientSchema, printSchema} from 'graphql';
import createLogger from './createLogger';
import ora from 'ora';
import fs from 'fs-extra';
import axios from 'axios';

const logger = createLogger();

const getSchemaFromResponse = ({data: {data: schema}}) => buildClientSchema(schema);
const getErrorsFromResponse = ({data: { errors = [] }}) => errors;

const createSpinner = (text) => ora({text, color: 'blue'}).start();

const introspect = async ({url, config = {}}, {descriptions = false} = {}) => axios
    .post(url, {query: getIntrospectionQuery({descriptions})}, config);

const fetchIntrospectiveSchema = async (requestConfig, queryOptions) => {
    const introspectionResponse = await introspect(requestConfig, queryOptions);

    const errors = getErrorsFromResponse(introspectionResponse);
    if (errors.length !== 0) {
        const error = errors[0];
        throw new Error(error.message);
    }

    return getSchemaFromResponse(introspectionResponse);
};

/**
 * Fetches schema sdl from and endpoint using introspection.
 * 
 * @param {{url: string, config: object?}} requestConfig - url is the graphql endpoint you wish to use. Config is passed
 * to the Axios client (AxiosRequestConfig).
 * @param {{descriptions: boolean?}?} queryOptions - options used for generating query.
 * @returns {Promise<string>}
 */
export const fetchSchemaSDL = async (requestConfig, queryOptions) => {
    const schema = await fetchIntrospectiveSchema(requestConfig, queryOptions);
    return printSchema(schema);
};

const fetchSchema = async (url, {user: username, password, fileName, descriptions}) => {
    const useBasicAuth = username !== undefined && password !== undefined;
    const authInfo = useBasicAuth ? [['User:', username], ['Password:', password]] : [];
    
    logger.table([
        ['GraphQL Endpoint:', url],
        ...authInfo
    ]);

    const config = useBasicAuth ? {auth: {username, password}} : {};

    const spinner = createSpinner('Loading schema...');
    const sdl = await fetchSchemaSDL({url, config}, {descriptions})
        .catch(error => {
            spinner.fail(error.message);
            throw new Error(error.message);
        });
    spinner.succeed('Done fetching schema!');
    
    if (fileName !== undefined) {
        const spinner = createSpinner('Writing schema to file...');
        await fs.outputFile(fileName, sdl).catch(error => {
            spinner.fail(error.message);
            throw new Error(error.message);
        });
        spinner.succeed(`Done writing schema to ${fileName}!`);
        return;
    }

    console.log(sdl);
};


export default fetchSchema;