To test:

Run hertzRank.js in one terminal

Run generateTraffic.js in other terminal
    BURST => concurrent hits,
    UNIQN => unique users



---------------------------------------------------------------------------------

Works better -
1) if inc/dec has total fixed steps - of total possible score values
2) under high load
3) lazy rank


sorted list prog => [score1, score2, score3]
sorted list prog:score1 => [user1, user2, user3] => insert by date (in milliseconds from dawn)

node cache {
    scores: [score1, score2, ...],
    cardinals: [sizeof(prog:score1), sizeof(prog:score2), ....]
    score1:info: {
        rank: 0
    },
    score2:info: {
        rank: (score1:info.rank) + cardinals[0] // cumulative rank of this score
    },
    .
    ..
}

to get user rank => 
1 + node cache(score:info.rank) + (zrank in prog:score1 sortedlist)

update score and rank algo:
1) if exists(old_score) => remove it from sorted list prog:old_score => O(log(distribution))
2) new_score => add to prog:new_score O(log(distribution)), add to prog:scores O(log(unique_scores))
3) get score rank => 
    a) hit => O(1) (Increases as time passes)
    b) reload cache => get prog:scores O(unique_scores) => get zcard of prog:score1 O(unique_scores)
4) get zrank in prog:new_score bucket => O(log(distribution))

Total complexity =
d = distribution
u = unique_scores
K = cache access time
h = probability that score rank is found in node cache
log(d) + log(d) + log(u) + h*(K) + 2*(1-h)*(u) + log(d)

calculate top ranks algo:
1) get_scores => if hit only then proceed => O(1)
2) zrange for each of scores => O(unique_scores)
3) joining each users => O(top_ranks)

Total complexity = 
n = required top ranks
u = unique_scores
h = probability that cache is found
u + n



