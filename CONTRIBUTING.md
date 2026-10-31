# Branching strategy

`main` is the live code: everything on it is ready to deploy. All work happens on a short-lived branch and reaches `main` through a pull request.

| Change | Branch name | Version bump in `CHANGELOG.md` |
|---|---|---|
| New page, function or behaviour | `feature/<short-name>` | Minor: 4.9.0 to 4.10.0 |
| Something that is broken | `bugfix/<short-name>` | Patch: 4.9.0 to 4.9.1 |

Branch names use lowercase letters, numbers, dots, dashes and underscores after the prefix, such as `feature/job-alerts` or `bugfix/reset-link-expiry`. An urgent fix on the live site is a `bugfix/` branch too.

## Steps

1. Start from the latest `main`:

   ```bash
   git switch main
   git pull
   git switch -c feature/job-alerts
   ```

2. Make the change, and update `CHANGELOG.md` and `SCRATCHPAD.md` with it.
3. Run `pnpm check`.
4. Send it to GitHub with `pnpm sync`, which commits and pushes the branch you are on.
5. Open a pull request into `main` on GitHub, and wait for CI to pass.
6. Merge it, and delete the branch.
7. Upload the new deployment from the updated `main`.

## How `pnpm sync` follows these rules

- **On a `feature/` or `bugfix/` branch:** commits your changes and pushes that branch.
- **On `main`:** sends nothing. If you have changes, it stops and they stay on your computer, so move them to a branch with `git switch -c feature/<short-name>`. With no local changes, it brings `main` up to date with GitHub.
- **On any other branch:** stops without committing or pushing.

The scheduled task works the same way, so it only publishes work while a `feature/` or `bugfix/` branch is checked out.

## Protecting `main` on GitHub

These rules need a repository admin to set them once. Until then, GitHub itself still accepts direct pushes to `main`.

In the repository, go to **Settings > Branches > Add branch ruleset** (or **Add classic branch protection rule**) for `main`, and turn on:

- Require a pull request before merging
- Require status checks to pass, selecting `check` and `branch-name`
- Block force pushes
