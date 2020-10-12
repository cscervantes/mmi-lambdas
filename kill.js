const { exec } = require('child_process')
const _ = require('lodash')
const util = require('util')
const execPromise = util.promisify(require('child_process').exec)

const getPID = () => {
    return new Promise((resolve, reject)=>{
        try{
            exec('ps -C node -o stime,pid,user:20,%cpu,%mem,comm,args | grep '+process.argv[2], function(error, stdout, stderr){
               if(error){
                   reject(error)
               }else{
                    let arrC = _.compact(stdout.split('\n'))
                    let mapC = arrC.map(function(v){
                        let process_lists = _.compact(v.split(' '))
                        // console.log(process_lists)
                        let validId = parseInt(process_lists[1])
                        if(Number.isInteger(validId)){
                            return {time:process_lists[0], pid:validId}
                        }else{
                            return {time:process_lists[0], pid:process_lists[2]}
                        }
                    })
		    // console.log(JSON.stringify(mapC))
                    let oldC = mapC.filter(function(v){
                        return Number.isInteger(v.pid) !== false
                    })
		    // console.log(oldC)
                    resolve(mapC)
               }
            })
        }catch(e){
            reject('Something went wrong!', e)
        }
    })
}


const sigKill = async (element) => {
	const p = new Promise( async (resolve, reject)=>{
		try{
                	//exec('kill -9 '+element.pid, function(error, stdout, stderr){
                    	//	if(error){
			//		console.error(error)
                        //		reject(error)
                    	//	}else{
			//		console.log(stdout)
                       	//		resolve(stdout)
                    	//	}
                	//})
                  	console.log(element.pid)
			const { stdout, stderr } = await execPromise('kill -9 '+element.pid)
			if(stderr){
				reject(stderr)
			}else{
				resolve(stdout)
			}
		}catch(e){
			reject(e)
		}
	})
	return p
}

const killP = async () => {
    try{
        let pids = await getPID()
	// console.log(pids)
	// process.exit()
        let process = await Promise.allSettled(pids.map(async (pid) => await sigKill(pid)))
	return process
    }catch(e){
        return e
    }
}

// killP()
killP().then(v=>{
v.forEach(e=>{
console.log(e)
})
}).catch(console.error)