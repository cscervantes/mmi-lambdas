const _ = require('lodash')
const util = require('util')
const execPromise = util.promisify(require('child_process').exec)

const listPID = (cmd) => {
    return p = new Promise( async (resolve, reject) => {
        try {
            const { stdout, stderr } = await execPromise(cmd)
            if(stderr) reject(stderr);
            else resolve(stdout)
        } catch (error) {
            reject(error)
        }
    })
}

let commandQuery = 'ps -C node -o stime,pid,user:20,%cpu,%mem,comm,args | grep '+process.argv[2]

listPID(commandQuery).then(console.log).catch(console.error)