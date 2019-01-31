## [v1.6.6]

> Jan 31, 2019

- Fix for ignoring passed in output directory and file extension

## [v1.6.5]

> Jan 26, 2019

- Updated dependencies
- Fixed tests and warnings

## [v1.6.4]

> Jan 17, 2019

- Add `public:` attribute prefix to expose public props

## [v1.5.0]

> Jul 12, 2017

- Set component type option to ES6 by default
- Remove `false` value for module type option
- Update CLI help text

## [v1.4.1]

> Jul 10, 2017

- Use Prettier for output formatting
- Use Jest for testing

## [v1.4.0]

> Jan 26, 2016

- Fix inline styles conversion, [issue #9](https://github.com/roman01la/html-to-react-components/issues/9)
- Add `--NO_WRITE_FS` env variable to disable Node's `fs` module when building for browser

[v1.4.0]: https://github.com/roman01la/html-to-react-components/compare/v1.3.2...v1.4.0

## [v1.3.2]

> Jan 17, 2016

- Fix Babylon version

[v1.3.2]: https://github.com/roman01la/html-to-react-components/compare/v1.3.1...v1.3.2

## [v1.3.1]

> Jan 11, 2016

- Reset `esformatter` settings after every run.
- Make tests green again.

[v1.3.1]: https://github.com/roman01la/html-to-react-components/compare/v1.3.0...v1.3.1

## [v1.3.0]

> Jan 11, 2016

- If no `moduleFileNameDelimiter`, `-d` is specified, the filename of the component is set to the value of `data-component` attribute in HTML.
- Added project website.
- Added changelog.

[v1.3.0]: https://github.com/roman01la/html-to-react-components/compare/v1.2.1...v1.3.0

## [v1.2.1]

> Jan 6, 2016

- Format generated code ([#1])

[v1.2.1]: https://github.com/roman01la/html-to-react-components/compare/v1.2.0...v1.2.1

## [v1.2.0]

> Jan 4, 2016

- Better documentation.
- Added CLI.
- Added tests.
- Added to Travis CI.
- Added default output dir name `components`.
- Always write to file system.

[v1.2.0]: https://github.com/roman01la/html-to-react-components/compare/v1.1.3...v1.2.0

## [v1.1.3]

> Dec 31, 2015

- Fix delimiter in output file names not being used from passed in options object.

[v1.1.3]: https://github.com/roman01la/html-to-react-components/compare/v1.1.2...v1.1.3

## [v1.1.2]

> Dec 31, 2015

- Big refactor. Split code base into separate modules.

[v1.1.2]: https://github.com/roman01la/html-to-react-components/compare/v1.1.1...v1.1.2

## [v1.1.1]

> Dec 30, 2015

- Use `htmltojsx` to translate HTML attributes into JSX.

[v1.1.1]: https://github.com/roman01la/html-to-react-components/compare/v1.1.0...v1.1.1

## [v1.1.0]

> Dec 30, 2015

- Implemented generation of ES2015 and stateless React components.
- Implemented generation of ES2015 and CommonJS modules.
- Implemented writing generated modules into file system.

[v1.1.0]: https://github.com/roman01la/html-to-react-components/compare/1.0.0...v1.1.0

## v1.0.0

> Dec 30, 2015

- Implemented generation of ES5 React components.
