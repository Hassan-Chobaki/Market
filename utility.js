function makeLock(l){
    let lock=l;

    lock=Math.random()*1000;
    return l+'-'+String(lock);
}


function openLock(l){
    
    
    return l.split('-');

}