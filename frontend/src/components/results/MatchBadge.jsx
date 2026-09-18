export default function MatchBadge({score}){

    let colour="";

    let text="";

    if(score>=90){

        colour="bg-emerald-100 text-emerald-700";

        text="Excellent";

    }

    else if(score>=75){

        colour="bg-yellow-100 text-yellow-700";

        text="Good";

    }

    else{

        colour="bg-rose-100 text-rose-700";

        text="Fair";

    }

    return(

        <span
        className={`text-xs px-2 py-1 rounded-full ${colour}`}
        >

        {text}

        </span>

    )

}