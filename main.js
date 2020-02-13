
var room=require('room')
var creep=require('creep')
var SourceKeeperCtrl=require('SourceKeeperCtrl')
var Visualizer_1 = require("./Visualizer");
var labCtrl = require('labCtrl');
global.TASK_CARRY='task_carry'
global.TASK_CENTER='task_center'
global.TASK_WORK='task_work'
require('prototype.Room.structures')
require('prototype.Creep.move');
require('prototype.Creep.move').moveCache.clear();


module.exports.loop = function () {
    //Memory.rooms['E9N8'].tasks=[]
    room.run()
    creep.run()
    SourceKeeperCtrl.run('E9N8')
    Visualizer_1.Visualizer.visuals();
    
}