import subprocess
import shutil
import os
import re

PKGSCRIPTS_PATH = '/home/masden/Projects/toolkit/pkgscripts-ng'
PACKAGE_PATH = '/home/masden/Projects/toolkit/source/HomeLibrary'
PACKAGE_VERSION = '0.0.2'

def build_releases():
    print('Build API project')
    subprocess.check_call('npm i --prefix api', shell=True)
    subprocess.check_call('npm run --prefix api build', shell=True)
    print('Build Web project')
    subprocess.check_call('npm i --prefix web', shell=True)
    subprocess.check_call('npm run --prefix web release', shell=True)


def remove_package_folder():
    print('Remove old package folder')
    if os.path.isdir(PACKAGE_PATH) is True:
        shutil.rmtree(PACKAGE_PATH)


def copy_folders():
    print('Copy files and folders')
    shutil.copytree('package', PACKAGE_PATH)
    shutil.copy('LICENSE', os.path.join(PACKAGE_PATH, 'LICENSE'))
    shutil.copytree('api/dist', os.path.join(PACKAGE_PATH, 'system/api/dist'))
    shutil.copy('api/.env.production', os.path.join(PACKAGE_PATH, 'system/api/.env'))
    shutil.copy('api/package.json', os.path.join(PACKAGE_PATH, 'system/api/package.json'))
    shutil.copytree('web/dist/home-library', os.path.join(PACKAGE_PATH, 'system/web'))


def fix_resources_configuration():
    print('Apply configuration')
    config = read_config()
    resource_file_path = os.path.join(PACKAGE_PATH, 'conf/resource')
    replace_data = {}
    replace_data['<db-name>'] = config['DB_NAME']
    replace_data['<db-user>'] = config['DB_USER_NAME']
    replace_data['<db-user-password>'] = config['DB_USER_PASSWORD']
    replace_file_content(resource_file_path, replace_data)


def read_config():
    config={}
    pattern = re.compile(r'([A-Z_]+)=(.*)')
    with open('api/.env.production', 'rt') as f:
        for line in f:
            result = pattern.match(line)
            if(result is not None):
                config[result.group(1)] = result.group(2)
    return config


def apply_version():
    print('Apply package version')
    info_file_path = os.path.join(PACKAGE_PATH, 'INFO.sh')
    replace_data = { '<version>': PACKAGE_VERSION }
    replace_file_content(info_file_path, replace_data)


def replace_file_content(file_path, data):
    # Read in the file
    with open(file_path, 'r') as file :
        filedata = file.read()

    # Replace
    for key in data:
        filedata = filedata.replace(key, data[key])

    # Write the file out again
    with open(file_path, 'w') as file:
        file.write(filedata)


def make_package():
    pkgcreate_path = os.path.join(PKGSCRIPTS_PATH, 'PkgCreate.py')
    subprocess.check_call(pkgcreate_path + ' -v 7.0 -p armada38x -c HomeLibrary', shell=True)


def main():
    build_releases()
    remove_package_folder()
    copy_folders()
    fix_resources_configuration()
    apply_version()
    make_package()


main()