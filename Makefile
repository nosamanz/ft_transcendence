#USER_HOME = $(HOME)

all:
#	sudo mkdir -p $(USER_HOME)/data/mysql
#	sudo mkdir -p $(USER_HOME)/data/wordpress
#	export USER_HOME=$$HOME && docker-compose up -d --build
	docker-compose up -d --build

down:
	docker-compose down

re: fclean all

clean:
	docker-compose down -v --remove-orphans

fclean: down
	docker system prune -af
#	sudo rm -rf $(USER_HOME)/data/*

.PHONY: all down re clean fclean