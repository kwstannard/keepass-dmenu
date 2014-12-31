# keepass-dmenu

Keepass2 client for .kdbx files based on dmenu.

It is only meant for read access to the file, so you still need a full
GUI client to do your editing and changing of password entries.

## Usage

Minimal working invocation is shown below:

```
$ keepass-dmenu --database path/to/database.kdbx
```

All command line options:

```
--database        Takes the path to the database file, relative from
                  your current working directory or as an absolute path.
                  [required]

--password        Takes one argument; the password to the given file.
                  Mostly useful for debugging. If it is not provided,
                  it will prompt for the password using dmenu.
                  [optional]

--label           Takes one argument; what property of the selected entry
                  you wish to return. You can select from the following
                  types of labels:
                   - password
                   - username
                   - url
                   - notes
                  [optional]
```

## Installation

It can be installed by running the following command in your terminal:
```
$ npm install -g keepass-dmenu
```

## Requirements

The following software should be installed:
 - node.js
 - npm
 - dmenu

## Compatability

The implementation is only tested on Ubuntu 14.10, with i3wm. It
should work under any window manager on any linux system as long as
dmenu is available.

If you encounter problems that is related to this code I will
willingly accept any pull requests as long as they are reasonable. And
if you need an extra eye on a problem feel free to open an issue.

## License

See the LICENSE file.
