// eslint-disable-next-line import/no-extraneous-dependencies
const concurrently = require('concurrently');
const os = require('os');

const { projects } = require('../nest-cli.json');

async function buildServices(maxProcess = undefined) {
  try {
    const commands = Object.entries(projects)
      .map(([name, prop]) => prop.type === 'application' && name)
      .filter((r) => !!r)
      .map((service) => ({
        command: `yarn exec nest build ${service}`,
        name: service,
      }));

    await concurrently(['yarn prebuild', ...commands], {
      maxProcesses: maxProcess ?? os.cpus().length,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

buildServices(process.env.BUILD_MAX_CPU);
