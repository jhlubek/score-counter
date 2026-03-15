default: serve

tw:
	./tailwindcss -c tailwind.config.js -i shared/input.css -o shared/output.css --minify

tw-watch:
	./tailwindcss -c tailwind.config.js -i shared/input.css -o shared/output.css --watch

test:
	node hearts/tests/game_logic_test.js

check: tw test

serve: tw
	python3 -m http.server 8080

kill:
	-lsof -ti:8080 | xargs kill -9 2>/dev/null || true
