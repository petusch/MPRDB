//выборка с использованием регулярных выражений
db.forTask.find({"exobj.firstname": /f/}).comment("Выводит объект, у которого в имени есть буква 'f'").pretty();
db.forTask.aggregate({$match: {"exobj.firstname": /f/}}).pretty();