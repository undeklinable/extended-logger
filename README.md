extended-logger
===============
Description
-------------
Extends winston module by including additional information to the log messages, for a better traceability.

Each log message will include:

* User-defined module identifier
* PID of the NodeJS process
* (Optional) Unique identifier associated to the current stack. Useful to trace network request

Usage
-------

When requiring the module, the following parameters can be provided to configure the logging information

* Module identifier
* Order of additional information [optional]