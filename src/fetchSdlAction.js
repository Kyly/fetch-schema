import {getIntrospectionQuery, buildClientSchema, printSchema} from 'graphql';
import createLogger from './createLogger';
import ora from 'ora';
import fs from 'fs-extra';
import axios from 'axios';

const logger = createLogger();
const getSchemaFromResponse = ({data: {data: schema}}) => buildClientSchema(schema);
const introspect = (url, auth) => axios
    .post(url, {query: getIntrospectionQuery({descriptions: true})}, {auth});
const createSpinner = () => ora({ text: 'Loading schema...', color: 'blue'}).start();

const fetchSdlAction = async (url, {user: username, password, fileName}) => {
    logger.table([
        ['GraphQL Endpoint:', url],
        ['User:', username],
        ['Password:', password]
    ]);

    const spinner = createSpinner();
    const introspectionResponse = await introspect(url, {username, password});
    spinner.succeed('Done!');

    const schema = getSchemaFromResponse(introspectionResponse);
    const sdlString = printSchema(schema);

    if (fileName !== undefined) {
        await fs.outputFile(fileName, sdlString);
        logger.info(`Done writing schema to ${fileName}.`);
        return;
    }

    console.log(sdlString);
};

export default fetchSdlAction;