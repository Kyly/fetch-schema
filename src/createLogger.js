import chalk from 'chalk';

const DEFAULT_STYLES = {
	data: chalk.green,
	input: chalk.cyan,
	warning: chalk.yellow,
	success: chalk.green,
	error: chalk.bold.red,
	info: chalk.bold.white,
	em: chalk.bold,
};

// noinspection JSUnusedLocalSymbols
const noop = (...args) => {}; 

export const noopLogger = {
	table: noop,
	info: noop,
	debug: noop,
	trace: noop,
	error: noop,
	warn: noop,
	log: noop,
};

export default ({logger = console, style = DEFAULT_STYLES} = {}) => {

	const info = (...args) => {
		logger.info(style.info(...args));
	};

	const log = (...args) => {
		logger.log(style.info(...args));
	};

	const debug = (...args) => {
		logger.debug(...args);
	};

	const trace = (...args) => {
		logger.trace(...args);
	};

	const error = (...args) => {
		logger.error(style.error(...args));
	};

	const warn = (...args) => {
		logger.warn(style.warning(...args));
	};

	const table = (dictionary) => {
		if (!Array.isArray(dictionary)) {
			return;
		}

		const formattedData = dictionary.reduce((acc, curr) => {
			if (!Array.isArray(curr)) {
				return;
			}
			const [name, ...values] = curr;
			return [...acc, style.em(name), ...values.map(value => style.input(value)), '\n'];
		}, ['\n']);

		log(...formattedData);
	};

	return {
		style,
		table,
		info,
		debug,
		trace,
		error,
		warn,
		log,
	};
};