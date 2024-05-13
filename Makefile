dev:
	docker-compose -f ./docker-compose.dev.yml up -d --build
dev-down:
	docker-compose -f ./docker-compose.dev.yml down
server-logs:
	docker logs --follow --tail 100 api
ai-server-logs:
	docker logs --follow --tail 100 ai-stuff
client-logs:
	docker logs --follow --tail 100 client
ps-logs:
	docker logs --follow db
