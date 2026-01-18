#!/usr/bin/env python3
"""
Setup script with post-install hook to auto-configure canon-keeper.
"""
from setuptools import setup
from setuptools.command.install import install
from pathlib import Path
import sys


class PostInstallCommand(install):
    """Custom install command that runs canon-keeper after pip install."""
    
    def run(self):
        # Run the standard install
        install.run(self)
        
        # Now run the installer
        print("\n" + "=" * 50)
        print("🔧 Running Canon Keeper installer...")
        print("=" * 50 + "\n")
        
        try:
            from canon_keeper.install import main as install_main
            install_main()
        except Exception as e:
            print(f"⚠️  Post-install setup failed: {e}")
            print("You can run 'canon-keeper' later to configure manually.")


if __name__ == "__main__":
    setup(
        cmdclass={
            'install': PostInstallCommand,
        }
    )
