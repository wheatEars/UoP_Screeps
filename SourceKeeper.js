module.exports = {
    run:function(creep,flag){

        //container不存在就建一个
        var container = Game.getObjectById(flag.memory.container);
        if(!container&&creep.room.controller.level>3){
            container = flag.pos.lookFor(LOOK_STRUCTURES).find(o =>(o.structureType == STRUCTURE_CONTAINER))
            if(!container){
                flag.pos.createConstructionSite(STRUCTURE_CONTAINER)
            }else{
                flag.memory.container = container.id;
            }
        }
        //移动到旗子
        if(!creep.pos.isEqualTo(flag.pos)){
            creep.moveTo(flag.pos);
            return;
        }
        //现在确保移动到了旗子位置
        //读取flag里面存的资源，不合法再找
        
        var source = Game.getObjectById(flag.memory.source);
        if(creep.harvest(source) != OK){
            if(flag.secondaryColor==COLOR_YELLOW){
            source = flag.pos.findInRange(FIND_SOURCES,1)[0]
        }
        if(flag.secondaryColor==COLOR_WHITE){
            source = flag.pos.findInRange(FIND_MINERALS,1)[0]
        }
            flag.memory.source = source.id;
        }
        //看看地上有没有掉的资源
        const droppedResource = creep.pos.lookFor(LOOK_ENERGY)[0];
        if(droppedResource){
            creep.pickup(droppedResource)
        }
        //有link，就往link里面填，没有就隔100ticks找一下
        var link = Game.getObjectById(flag.memory.link);
        if(link){
            creep.transfer(link,RESOURCE_ENERGY);
        }else if(Game.time % 100 == 0){
            var links = flag.pos.findInRange(FIND_STRUCTURES,1,
                {filter:o=>(o.structureType == STRUCTURE_LINK)});
            if(links.length){
                flag.memory.link = links[0].id;
            }
        }
        if(link && container){
            if(link.store[RESOURCE_ENERGY] < link.store.getCapacity(RESOURCE_ENERGY) &&
            container.store[RESOURCE_ENERGY] > 0){
                if(creep.store.getFreeCapacity(RESOURCE_ENERGY)){
                    creep.withdraw(container,RESOURCE_ENERGY)
                }
            }
        }
    }
}