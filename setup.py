from setuptools import setup, find_packages

setup(
    name="release-manager",
    version="0.0.6",
    packages=find_packages(),
    install_requires=[
        "flask",
        "flask-cors",
        "pytest",
        "pytest-flask"
    ],
) 