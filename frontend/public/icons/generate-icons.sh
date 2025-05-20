#!/bin/bash

# Create icons directory if it doesn't exist
mkdir -p icons

# Generate PWA icons from the logo
convert ../../src/Pages/Images/logo.svg -resize 192x192 icon-192x192.png
convert ../../src/Pages/Images/logo.svg -resize 512x512 icon-512x512.png
