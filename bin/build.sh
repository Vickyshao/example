#!/bin/bash
echo "**********************************tar example begin*************************************"
rm -rf example.tar.gz
cd ..
chmod 755 default -R
cd default
tar --exclude _source --exclude .git --exclude bin -czvf example.tar.gz .
echo "**********************************tar example end*************************************"