module.exports={
	run:function(creep){
		if(!creep.memory.doing){
		    if(creep.memory.taskList==undefined){
		        creep.memory.taskList=[]
		    }
			if(creep.memory.taskList.length>0){
				creep.memory.doing=creep.memory.taskList[0]
				creep.memory.taskList.splice(0)
			}
			else{
				creep.say('Zzz')
			}
		}
		else{
			switch(creep.memory.role){
				case TASK_CARRY:require('creep.task.carry').run(creep)
				case TASK_CENTER:require('creep.task.center').run(creep)
				case TASK_WORK:require('creep.task.work').run(creep)
			}
		}
	}
}