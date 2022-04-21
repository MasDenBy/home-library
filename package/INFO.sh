#!/bin/bash

source /pkgscripts-ng/include/pkg_util.sh

package="HomeLibrary"
version="0.0.1"
os_min_ver="7.0-40000"
#install_dep_packages="WebStation>=3.0.0-0323:PHP7.4>=7.4.18-0114:Apache2.4>=2.4.46-0122"
maintainer="MasDenBy"
maintainer_url="https://github.com/MasDenBy/"
#distributor="MyCompany"
#distributor_url="http://app.mycompany.com"
silent_upgrade="no"
arch="noarch"
dsmappname="by.masden.homelibrary"
dsmuidir="ui"
displayname="Home Library"
#displayname_enu="Web example package"
#displayname_cht="Web 範例套件"
description="Home Library"
#description_enu="This my sample package"
#description_cht="這是我的範例套件"

[ "$(caller)" != "0 NULL" ] && return 0

pkg_dump_info
