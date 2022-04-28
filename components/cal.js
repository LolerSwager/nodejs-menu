export default function timeDate(){
    return(new Date().toLocaleString('dk-DK',{
        timeZone: 'denmark/Copenhagen'
    }));
}