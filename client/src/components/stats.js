function Stats({selectedCharacter, stats}) {
    // console.log('stats:', stats);

    const endGameStats = stats.endgame?.map((stat, i) => {
        return (
            <li key={i}>
                {stat}
            </li>
        )
    });

    const tracesPriority = stats.traces?.map((stat, i) => {
        return (
            <li key={i}>
                {stat}
            </li>
        )
    });

    return(
        <div className='Stats'>
            <h2>{selectedCharacter}</h2>

            <h3>Recommended Endgame Stats</h3>
            <ul>
                {endGameStats}
            </ul>

            <h3>Traces Priority</h3>
            <ul>
                {tracesPriority}
            </ul>
            
        </div>
    );
}

export default Stats;