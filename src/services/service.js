// react-select functions for styling
const customStyles = {
    option:(provided,state)=>({
        ...provided,
        color:state.isSelected?'white':'black',
        cursor:state.isDisabled?'not-allowed':'pointer',
        backgroundColor:state.isDisabled?'white':state.isSelected?'var(--main-color)':state.isFocused&&'var(--input-border-bottom)'
        
    })
}
const customTheme=(theme)=>{
    return {
        ...theme,
        colors:{
            ...theme.colors,
            primary:'var(--main-color)',
            primary25:'var(--input-border-bottom)'
        }
    }
}
//function for generating random color
const generateColor = () =>{
    let color = Math.random().toString(16).substr(-6);
    return color
};

//mrthod for multi page components (grid data,small images gallery)
const multiPageIndex=(index,pagesNumber)=>{
        //if passed index > number of pages return index of first page
        if((index > pagesNumber-1 && pagesNumber%1==0) || (index > pagesNumber && pagesNumber%1)){
            return 0
        }
        //if passed index < number of pages return index of last page
        else if(index<0){
            if(pagesNumber%1){
            return Math.floor(pagesNumber)
            }
            else{
            return pagesNumber-1
        }
        }
        //if none of previous conditions return passed index
        else{
            return index
        }
}


export {customStyles,customTheme,generateColor,multiPageIndex}