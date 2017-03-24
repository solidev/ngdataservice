<a name="0.1.0-beta.3"></a>
# [0.1.0-beta.3](https://gitlab.com/solidev/ngdataservice/compare/v0.1.0-beta.2...v0.1.0-beta.3) (2017-03-24)



<a name="0.1.0-beta.2"></a>
# [0.1.0-beta.2](https://gitlab.com/solidev/ngdataservice/compare/v0.1.0-beta.1...v0.1.0-beta.2) (2017-03-19)


### Bug Fixes

* **DSFilter:** Give an empty value (not undefined nor null) to filter fields by default ([d46f7a6](https://gitlab.com/solidev/ngdataservice/commit/d46f7a6))


### Chores

* **deps:** Upgrade deps to angular[@4](https://github.com/4).0.0-rc.5 + fix DI after angular#12631 solve ([f1f44d7](https://gitlab.com/solidev/ngdataservice/commit/f1f44d7)), closes [angular#12631](https://gitlab.com/angular/issues/12631)


### BREAKING CHANGES

* **deps:** Need angular >= 4.0.0-rc.5



<a name="0.1.0-beta.1"></a>
# [0.1.0-beta.1](https://gitlab.com/solidev/ngdataservice/compare/0.0.9...v0.1.0-beta.1) (2017-03-10)

Added angular4 support


<a name="0.0.9"></a>
## [0.0.9](https://gitlab.com/solidev/ngdataservice/compare/0.0.8...v0.0.9) (2017-02-13)


### Features

* **IDSFilter:** Add partial update parameter to filter.update() ([4ff8e9f](https://gitlab.com/solidev/ngdataservice/commit/4ff8e9f))



<a name="0.0.8"></a>
## [0.0.8](https://gitlab.com/solidev/ngdataservice/compare/v0.0.7...v0.0.8) (2017-02-05)


### Bug Fixes

* **queryset:** Add error propagation to queryset.get() ([8013d14](https://gitlab.com/solidev/ngdataservice/commit/8013d14))



<a name="0.0.7"></a>
## [0.0.7](https://gitlab.com/solidev/ngdataservice/compare/v0.0.6...v0.0.7) (2017-02-04)



<a name="0.0.6"></a>
## [0.0.6](https://gitlab.com/solidev/ngdataservice/compare/v0.0.5...v0.0.6) (2017-02-03)


### Bug Fixes

* **backend:** Add application/json Accept header for all requests ([1feb1a8](https://gitlab.com/solidev/ngdataservice/commit/1feb1a8)), closes [#1](https://gitlab.com/solidev/ngdataservice/issues/1)
* **collection:** Add context to collection.remove ([8ea4a1b](https://gitlab.com/solidev/ngdataservice/commit/8ea4a1b))
* **links:** Add context option to getLinked function, and correct context use in Collection.get ([6e80ced](https://gitlab.com/solidev/ngdataservice/commit/6e80ced))
* **model:** Add check for existing collection for model.coll.datastore ([13b13c3](https://gitlab.com/solidev/ngdataservice/commit/13b13c3))
* **queryset:** Update queryset code to work with small lodash footprint. Updated build to commonjs. ([e5eed1f](https://gitlab.com/solidev/ngdataservice/commit/e5eed1f))
* **testing:** Re-enable testing ([1d53668](https://gitlab.com/solidev/ngdataservice/commit/1d53668))


### Features

* **adapter:** Added coherent context to adapter for nested routes, sub collections, ... [WIP] ([a207069](https://gitlab.com/solidev/ngdataservice/commit/a207069))
* **build:** Enable aot support. ([50b4ee0](https://gitlab.com/solidev/ngdataservice/commit/50b4ee0))
* **collection:** Add xxxx_class for collection setup variants ([70645cc](https://gitlab.com/solidev/ngdataservice/commit/70645cc))
* **collection:** Added datasources property and setup methods for DSRegister ([5155b34](https://gitlab.com/solidev/ngdataservice/commit/5155b34))
* **collection:** added list to collection ([85d2b6a](https://gitlab.com/solidev/ngdataservice/commit/85d2b6a))
* **IDSCollection:** Add collection actions : Collection.action(null, action, args) ([540b634](https://gitlab.com/solidev/ngdataservice/commit/540b634))
* **IDSModel:** Add action to model ([0006604](https://gitlab.com/solidev/ngdataservice/commit/0006604))
* **IDSModel:** Add getLinked and getLinkedMany helper functions for model links ([5b4be65](https://gitlab.com/solidev/ngdataservice/commit/5b4be65))
* **list:** Make lists working ([af1a6d1](https://gitlab.com/solidev/ngdataservice/commit/af1a6d1))
* **queryset:** Added queryset instances to collection. ([68efdf5](https://gitlab.com/solidev/ngdataservice/commit/68efdf5))
* **restbackend:** Add default headers in REST_BACKEND_CONFIG and setDefaultHeaders method to DSRest ([3172c5c](https://gitlab.com/solidev/ngdataservice/commit/3172c5c))
* **service:** Removed service layer ([6d1a310](https://gitlab.com/solidev/ngdataservice/commit/6d1a310))





