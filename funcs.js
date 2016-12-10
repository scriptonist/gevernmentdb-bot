module.exports = {
    checkValidityAadhar:function(ano){
        console.log(ano);
        if(ano.toString().length == 12)
            return true;
        else
            return false;
    }
};