import url from 'url'

const currentDir = url.fileURLToPath(new URL('.', import.meta.url))
// console.log(currentDir)