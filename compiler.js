const fs = require('fs')
const path = require('path')

module.exports = (name, base, resources, dir) => {
    base.Resources = {}

    const nameString = s => s === '' ? '' : `${s[0].toUpperCase()}${s.slice(1)}`
    const nameMapper = s => nameString(s.trim())
    const requires = resources.map(
        r => ({
            name: name + r
                .split(/\/|\.js|-/gi)
                .map(nameMapper)
                .join(''),
            obj: require(path.join(dir, r))
        })
    )

    requires.forEach(r => base.Resources[r.name] = r.obj)

    const data = JSON.stringify(base)
    const outDir = path.join(dir, 'dist')
    const outPath = path.join(outDir, `${name}-Cloudformation.json`)
    const deleteFolderRecursive = function (path) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(file => {
                var curPath = path + '/' + file
                if (fs.lstatSync(curPath).isDirectory()) {
                    deleteFolderRecursive(curPath)
                } else {
                    fs.unlinkSync(curPath)
                }
            })
            fs.rmdirSync(path)
        }
    }

    deleteFolderRecursive(outDir)
    fs.mkdirSync(outDir)
    fs.writeFileSync(outPath, data)
    fs.createReadStream('lib/sharp-layer.zip').pipe(fs.createWriteStream('dist/sharp-layer.zip'))

    console.log(`Compile of Cloudformation JSON complete with the following resources:${requires.map(r => `\n${r.name}`)}`)
}