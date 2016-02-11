'use strict';

function getAbbreviation(contestant){
    if(contestant.abbrName) return contestant.abbrName.toUpperCase();
    return contestant.name.substring(0,3).toUpperCase();
}


exports.getAbbreviation = getAbbreviation;