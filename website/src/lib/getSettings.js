import {
  LAUNCH_PROJECT_CONFIGS,
  THEME_BASE,
  CONFIG,
  THEME,
} from 'lib/constants';
import _merge from 'lodash/merge';

/**
 * Returns site settings either from a multisite lookup, or from defined constants
 * Hostname comes from the middleware.
 *
 * @param   {string}  host     [hostname of site]
 * @param   {string}  project  [project key of site]
 *
 * @return  {object}           [PROJECT, CONFIG, THEME objects]
 */
export function getSettings({ req, host, project }) {
  const multisite = process.env.MULTISITE || false;

  if (multisite) {
    const launchHost = host || req?.headers['x-launch-host'];
    const launchProject = project || req?.headers['x-launch-project'];

    return multisiteSettings({
      host: launchHost,
      project: launchProject,
    });
  }

  return singleSiteSettings();
}

function singleSiteSettings() {
  return {
    PROJECT: null,
    CONFIG: CONFIG,
    THEME: THEME,
  };
}

function multisiteSettings({ host, project }) {
  // eslint-disable-next-line no-console
  // console.log(`getSettings: host: ${host}, project: ${project}`);
  if (!project && !host) {
    throw new Error('No host or project provided');
  }

  // have host, lookup project
  if (host && !project) {
    // console.log(`looking up project from host: ${host}`);
    // lookup project from hostname
    const findKey = (obj, predicate = (o) => o) =>
      Object.keys(obj).find((key) => predicate(obj[key], key, obj));

    project = findKey(LAUNCH_PROJECT_CONFIGS, function (o) {
      return o.site_domain == host;
    });

    if (!project) {
      // if no match, use the ENV defined project
      // console.log('no project still after host lookup, checking ENV');
      project = process.env.NEXT_PUBLIC_LAUNCH_HOST;
    }
  }

  if (project && !host) {
    // console.log('no host provided, must have project only');
    // todo, set host do we need to repeat logic from middleware?
    // should be DRY
  }

  if (project && !LAUNCH_PROJECT_CONFIGS[project]) {
    throw new Error(
      `Project '${project}' does not exist in LAUNCH_PROJECT_CONFIGS`,
    );
  }

  // https://stackoverflow.com/questions/28044373/use-lo-dash-merge-without-modifying-underlying-object
  const merged = _merge(
    {},
    THEME_BASE,
    LAUNCH_PROJECT_CONFIGS[project].theme,
  );

  return {
    PROJECT: project,
    CONFIG: LAUNCH_PROJECT_CONFIGS[project].config,
    THEME: merged,
  };
}
