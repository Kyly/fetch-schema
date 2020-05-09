import {getIntrospectionQuery, buildClientSchema, printSchema} from 'graphql';
import createLogger from './createLogger';
import ora from 'ora';
import fs from 'fs-extra';
import axios from 'axios';

const logger = createLogger();

const getSchemaFromResponse = ({data: {data: schema}}) => buildClientSchema(schema);
const getErrorsFromResponse = ({data: { errors = [] }}) => errors;

const createSpinner = () => ora({text: 'Loading schema...', color: 'blue'}).start();

const introspect = async (url, descriptions, config) => axios
    .post(url, {query: getIntrospectionQuery({descriptions})}, config);

const fetchIntrospectiveSchema = async (url, descriptions, config) => {
    const spinner = createSpinner();
    const introspectionResponse = await introspect(url, descriptions, config).catch(error => {
        spinner.fail(error.message);
        throw new Error(error.message);
    });

    const errors = getErrorsFromResponse(introspectionResponse);
    if (errors.length !== 0) {
        const error = errors[0];
        spinner.fail(error.message);
        throw new Error(error.message);
    }

    spinner.succeed('Done!');
    return getSchemaFromResponse(introspectionResponse);
};


const fetchSchema = async (url, {user: username, password, fileName, descriptions}) => {
    const useBasicAuth = username !== undefined && password !== undefined;
    const authInfo = useBasicAuth ? [['User:', username], ['Password:', password]] : [];
    
    logger.table([
        ['GraphQL Endpoint:', url],
        ...authInfo
    ]);

    const config = useBasicAuth ? {auth: {username, password}} : {};
    const schema = await fetchIntrospectiveSchema(url, descriptions, config);

    const sdlString = printSchema(schema);
    if (fileName !== undefined) {
        await fs.outputFile(fileName, sdlString);
        logger.info(`Done writing schema to ${fileName}.`);
        return;
    }

    console.log(sdlString);
};

export default fetchSchema;