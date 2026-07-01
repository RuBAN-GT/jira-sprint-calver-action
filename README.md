# jira-sprint-calver-action

GitHub Action: active Jira sprint → CalVer `yyyy.sprint` for unified polyrepo releases.

## Usage

```yaml
- uses: RuBAN-GT/jira-sprint-calver-action@v1 # or @master for bleeding edge
  id: calver
  with:
    jira-base-url: ${{ secrets.JIRA_BASE_URL }}
    jira-email: ${{ secrets.JIRA_EMAIL }}
    jira-token: ${{ secrets.JIRA_TOKEN }}
    board-id: "123"
- name: Use version
  run: echo ${{ steps.calver.outputs.product-version }}
```

Outputs: `product-version`, `sprint-number`, `sprint-name`, `fix-version-name`.

## Why this action

- Native fetch, zero extra deps
- TypeScript strict, no any
- Marketplace-ready, self-releasing via release-please

## Publish to Marketplace

1. Tag release
2. GitHub → Releases → "Publish to Marketplace"

Yarn 4 node-modules mode. Use `yarn install`.

MIT
