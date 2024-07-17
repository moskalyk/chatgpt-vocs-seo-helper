# chatgpt-vocs-seo-helper
use this repository to assist the production of SEO metadata content for every page from a [vocs](https://vocs.dev/) repository

> good to note, while using this tool, I had to change at least something in 90% of generated descriptions, but simple things like remove content from the end.

## how to run
1. create a new project with `mkdir <folder_name>`
2. cd into folder and clone your vocs docs inside the folder 
3. clone this repository `git clone git@github.com:moskalyk/chatgpt-vocs-seo-helper.git` also in the folder and run `pnpm install` or `npm install`
4. update the source folder path [here](https://github.com/moskalyk/chatgpt-vocs-seo-helper/blob/master/index.js#L7) with your documentation repository name
5. acquire a chat gpt API key and set [here](https://github.com/moskalyk/chatgpt-vocs-seo-helper/blob/master/index.js#L6)
6. run script `node index.js` in `chatgpt-vocs-seo-helper` folder, it will produce a folder called `pages_seo`
7. move and copy over your generated folder `pages_seo` into your documentation repository where the `/pages` folder was located and rename `pages_seo` to `pages`