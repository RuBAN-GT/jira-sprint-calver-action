import * as core from '@actions/core';

interface Sprint {
  id: number;
  name: string;
  state: string;
}

async function run(): Promise<void> {
  try {
    const baseUrl = core.getInput('jira-base-url', { required: true });
    const email = core.getInput('jira-email', { required: true });
    const token = core.getInput('jira-token', { required: true });
    const boardId = core.getInput('board-id', { required: true });
    const yearInput = core.getInput('year');
    const format = core.getInput('format') || 'yyyy.sprint';

    const year = yearInput || new Date().getFullYear().toString();
    const auth = Buffer.from(`${email}:${token}`).toString('base64');

    const url = `${baseUrl.replace(/\/$/, '')}/rest/agile/1.0/board/${boardId}/sprint?state=active`;
    const res = await fetch(url, {
      headers: { Authorization: `Basic ${auth}`, Accept: 'application/json' }
    });

    if (!res.ok) throw new Error(`Jira API error: ${res.status} ${res.statusText}`);

    const data = await res.json() as { values: Sprint[] };
    const active = data.values?.find((s: Sprint) => s.state === 'active');

    if (!active) throw new Error('No active sprint found');

    const match = active.name.match(/\d+/);
    if (!match) throw new Error(`Cannot parse sprint number from: ${active.name}`);

    const sprintNum = match[0];
    const productVersion = format.replace('yyyy', year).replace('sprint', sprintNum);

    core.setOutput('product-version', productVersion);
    core.setOutput('sprint-number', sprintNum);
    core.setOutput('sprint-name', active.name);
    core.setOutput('fix-version-name', productVersion);

    await core.summary
      .addHeading('Jira Sprint CalVer')
      .addTable([
        [{ data: 'Field', header: true }, { data: 'Value', header: true }],
        ['Product Version', productVersion],
        ['Sprint', `${active.name} (#${sprintNum})`],
        ['Year', year]
      ])
      .write();
  } catch (err) {
    core.setFailed((err as Error).message);
  }
}

run();
