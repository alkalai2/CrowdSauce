#!/usr/bin/env python
from __future__ import print_function
from sys import platform as _platform

import subprocess, platform, os

# Installs standard js style checker and installs pre-commit hook for it
# If you see errors in installation of:
# git, reference: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
# npm, reference: https://www.npmjs.com/package/download
# standard, reference: https://github.com/feross/standard

# If you have all them installed but are getting stuck due to unsupported platforms
# Comment out that step in the main function

pre_commit_hook = """
#!/bin/sh
# Ensure all javascript files staged for commit pass standard code style
git diff --name-only --cached --relative | grep '\.js$' | xargs standard
exit $?
"""

class GitNotInstalledException(Exception):
    def __init__(self, message):
        self.message = "Git not installed, see: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git"

def verify_git():
    """ Verifies if git is installed """
    git_out = subprocess.call("which git", shell=True)
    if git_out != 0:
        raise GitNotInstalledException()

def install_npm():
    """ Checks if npm is installed if not installs """
    try:
        npm_out = subprocess.call("which npm", shell=True)
        if npm_out == 0:
            return
        print("Attempting to install npm for %s" % (_platform))
        if _platform == "linux" or _platform == "linux2":
            distro, version, arch  = platform.dist()
            if(distro == "Ubuntu"):
                commands = ["curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -",
                            "sudo apt-get install -y nodejs"]
                print("Running commands {}".format(commands))
                subprocess.call(commands[0], shell=True)
                subprocess.call(commands[1], shell=True)
            else:
                print("Linux distro's other than Ubuntu not yet implemented")
                print("Refer to https://nodejs.org/en/download/package-manager/ for instruction")
        elif _platform == "darwin":
            brew_out = subprocess.call("which brew", shell=True)
            if brew_out != 0:
                raise Exception(
                        """
                        For automatic mac installation of NPM, package manager brew is required
                        see https://nodejs.org/en/download/package-manager/#osx for reference
                        """)
            command = "brew install npm"
            print("Running command %s" % (command))
            subprocess.call(command, shell=True)
        elif _platform == "win32":
            cinst_out = subprocess.call("which cinst", shell=True)
            if cinst_out != 0:
                raise Exception(
                        """
                        For automatic windows installation of NPM, package manager Cholatey is required
                        see https://nodejs.org/en/download/package-manager/#windows for reference
                        """)

            command = "cinst nodejs.install"
            print("Running command %s" % (command))
            subprocess.call(command, shell=True)

    except Exception as e:
        print(e)
    pass

def install_standard():
    """ Installs standard js linter from npm """
    standard_out = subprocess.call("which standard", shell=True)
    if standard_out == 0:
        print("Standard already installed")
        return
    command = "npm install standard -g"
    print("Running command: %s" % (command))
    out = subprocess.call(command, shell=True)
    if out != 0:
        raise Exception("Something failed installing standard linter from npm.")

def install_git_hook():
    """ Writes git hook to automatically lint js files """
    # Check if pre-commit hook already exists
    pre_commit_file = "./.git/hooks/pre-commit"
    if os.path.exists(pre_commit_file) and os.path.isfile(pre_commit_file):
        subprocess.call("mv {} {}.backup".format(pre_commit_file, pre_commit_file), shell=True)
    with open(pre_commit_file, 'w') as fh:
        print(pre_commit_hook, file=fh)
    subprocess.call("chmod +x {}".format(pre_commit_file))
    pass

def main():
    verify_git()
    install_npm()
    install_standard()
    install_git_hook()

if __name__ == "__main__":
    main()
