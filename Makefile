run_k6_test:
	node preprocess-env.js | xargs k6 run src/tests/${TEST_FILE}