# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.4.0](https://github.com/patronage/bubs-next/compare/v1.3.0...v1.4.0) (2023-08-10)


### Features

* multisite compatible getSettings and API functions ([#275](https://github.com/patronage/bubs-next/issues/275)) ([5a4c3e1](https://github.com/patronage/bubs-next/commit/5a4c3e1ee6d3fb6339bc908fcc817a6ab190d794))


### Bug Fixes

* don't error if flex section isn't in graphql ([#277](https://github.com/patronage/bubs-next/issues/277)) ([3e148f2](https://github.com/patronage/bubs-next/commit/3e148f276d1a1c6032c420d090020fc59df16e98))
* proper staging host in theme ([58911bf](https://github.com/patronage/bubs-next/commit/58911bf9c6b3011cea0dd1f96a40969ad7db4f9b))

## [1.3.0](https://github.com/patronage/bubs-next/compare/v1.2.0...v1.3.0) (2023-03-12)


### Features

* NPM/Yarn Dependency Pinning ([#259](https://github.com/patronage/bubs-next/issues/259)) ([d7fe603](https://github.com/patronage/bubs-next/commit/d7fe60329073b06b553495e2a6b8ba434d051661))
* super editor role that allows for safe permissions in headless wp ([#233](https://github.com/patronage/bubs-next/issues/233)) ([b4ca258](https://github.com/patronage/bubs-next/commit/b4ca258236578a9e5745c7e9272c050831bd3e3d))


### Bug Fixes

* nodeByUri/graphcdn fix ([#256](https://github.com/patronage/bubs-next/issues/256)) ([6a31a78](https://github.com/patronage/bubs-next/commit/6a31a7886b2504feea38cd36dfa86508e7774d0b)), closes [#229](https://github.com/patronage/bubs-next/issues/229)
* upstream dashbaord customizations so title is preserved ([#272](https://github.com/patronage/bubs-next/issues/272)) ([022501f](https://github.com/patronage/bubs-next/commit/022501f73cdf39ba70ff677e13000ff5bb4ad8c1))
* use public versions of wp env vars ([#253](https://github.com/patronage/bubs-next/issues/253)) ([728b95d](https://github.com/patronage/bubs-next/commit/728b95dadd7fd8e5ab816f364668a70e26c44441))

## [1.2.0](https://github.com/patronage/bubs-next/compare/v1.1.0...v1.2.0) (2022-07-01)


### Bug Fixes

* if preview auth code present, refresh token ([6bb552c](https://github.com/patronage/bubs-next/commit/6bb552c79d3bcb3f8715095194b0422aa813a7d2))
* logged out redirect to headless domain was sending broken link ([#208](https://github.com/patronage/bubs-next/issues/208)) ([a479422](https://github.com/patronage/bubs-next/commit/a479422047e08aa0979b3b0bf6607f6a8a04e714))
* preview mode bugs with preview on unpublished posts ([#193](https://github.com/patronage/bubs-next/issues/193)) ([64d875f](https://github.com/patronage/bubs-next/commit/64d875fe2c19103e45d28bc36fab16dfff1f5f4f))
* revalidate so pages can be published/unpublished ([#213](https://github.com/patronage/bubs-next/issues/213)) ([02ad07b](https://github.com/patronage/bubs-next/commit/02ad07bd77fd9ba0e6412cfad6d3e2a9f7b5b695)), closes [#201](https://github.com/patronage/bubs-next/issues/201)

## 1.1.0 (2021-12-30)

### Features

- bumping husky to version 7 ([#179](https://github.com/patronage/bubs-next/issues/179)) ([9558618](https://github.com/patronage/bubs-next/commit/95586184fa746cbcf17b196d5c13af0cb1c42edf))
- log wp admin users into front-end preview mode ([#173](https://github.com/patronage/bubs-next/issues/173)) ([cd143c4](https://github.com/patronage/bubs-next/commit/cd143c4316fa90b9783be2ac94260d6c9ee5591f))
- new convenience plugins in wordpress admin ([#166](https://github.com/patronage/bubs-next/issues/166)) ([81e95b8](https://github.com/patronage/bubs-next/commit/81e95b84efc82e9ecbd04f8475029f383685b819))
- Next 12 upgrade ([#180](https://github.com/patronage/bubs-next/issues/180)) ([c6f5dcd](https://github.com/patronage/bubs-next/commit/c6f5dcdd74c1bf07bf39accd21e480f50291c594))
- theme mod instead of acf options for preview mode url ([#163](https://github.com/patronage/bubs-next/issues/163)) ([65bf637](https://github.com/patronage/bubs-next/commit/65bf637b036e5332c5dd738ab52484e57aaec976)), closes [#162](https://github.com/patronage/bubs-next/issues/162)
- **wordpress:** :package: Upgrade Wordpress to 5.5.3; upgrade other WP plugins. ([0a6d5c9](https://github.com/patronage/bubs-next/commit/0a6d5c9dff02630e9feb44fa02617a0260b5f04e))

### Bug Fixes

- bug where prettier wasn't formatting JS files. ([c5ce6c5](https://github.com/patronage/bubs-next/commit/c5ce6c53dba7b8326a68327fd2c6d0573ec2ff95)), closes [#95](https://github.com/patronage/bubs-next/issues/95)
- don't include privacy scaffold, it sometimes forgets to be removed ([4722e4a](https://github.com/patronage/bubs-next/commit/4722e4a09ed22fc89817bcd6780bfc074df2545f))
- Get stylelint working again ([#182](https://github.com/patronage/bubs-next/issues/182)) ([d3d73ca](https://github.com/patronage/bubs-next/commit/d3d73ca86476d4899dd210ba25999910018f4836))
- meta not respecting social variables, customized title ([#176](https://github.com/patronage/bubs-next/issues/176)) ([c041759](https://github.com/patronage/bubs-next/commit/c041759db688bd2e6c7ec355bcb39f0f23b878a1)), closes [#174](https://github.com/patronage/bubs-next/issues/174) [#172](https://github.com/patronage/bubs-next/issues/172) [#177](https://github.com/patronage/bubs-next/issues/177) [#183](https://github.com/patronage/bubs-next/issues/183)
- vscode eslint plugin wasn't picking up next config without specifying directory ([020f378](https://github.com/patronage/bubs-next/commit/020f37854aae73925b83a77bb634a35574457acf))
