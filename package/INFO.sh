#!/bin/bash

source /pkgscripts-ng/include/pkg_util.sh

package="HomeLibrary"
version="<version>"
os_min_ver="7.0-40000"
install_dep_packages="WebStation>=3.0.0-0308:MariaDB10>=10.3.32-1040:Node.js_v12>=12.22.7-2029"
maintainer="MasDenBy"
maintainer_url="https://github.com/MasDenBy/"
silent_upgrade="no"
arch="noarch"
dsmappname="by.masden.homelibrary"
dsmuidir="ui"
displayname="Home Library"
description="Home Library"

[ "$(caller)" != "0 NULL" ] && return 0

pkg_dump_info
