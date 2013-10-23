Lilly Memory
============

A simple memory game in Angular that uses images from Instagram

Production
====

Deploy site:

```
git branch -D gh-pages
git checkout -b gh-pages
rm -rf config/
rm -rf cloud/
mv public/* .
git add .
git commit -a -m "Moved public to root"
git push -f origin gh-pages
git checkout master

```

or copy this whole line do it all at once: 

```
git branch -D gh-pages; git checkout -b gh-pages; rm -rf config/; rm -rf cloud/; mv public/* .; git add .; git commit -a -m "Moved public to root"; git push -f origin gh-pages;git checkout master;
```
