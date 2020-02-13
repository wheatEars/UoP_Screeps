module.exports={
	run:function(creep){
		if(!creep.memory.doing){
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
				case TASK_CARRY:require('task.carry').run(creep)
				case TASK_CENTER:require('task.center').run(creep)
				case TASK_WORK:require('task.work').run(creep)
			}
		}
	}
}