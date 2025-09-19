const timeformat=(minutes)=>{
    const hours=Math.floor(minutes/60);
    const minute=minutes%60;
    return `${hours}h ${minute}m`
}
export default timeformat;