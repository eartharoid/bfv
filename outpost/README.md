# Outpost

`node . --scrape`/ `node . --generate`: run once
`node .  --cron`: keep-alive

Members who haven't played BF1 aren't present in GameTools' data

1. fetch platoon members from Game Tools API
2. for each non-platoon player, fetch player and merge into platoon data if applicable
3. if currentSize !== members.length after merging, WARN
4. when saving/caching platoons (after merging), order members by role then name
5. merge each platoon members' into players
6. rename players
7. convert to a Set