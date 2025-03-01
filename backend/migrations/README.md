Generic single-database configuration with Alembic.

Pour créer une nouvelle migration:
```
alembic revision --autogenerate -m "description de la migration"
```

Pour appliquer toutes les migrations:
```
alembic upgrade head
```

Pour revenir à une version spécifique:
```
alembic downgrade <revision_id>
```

Pour obtenir la révision actuelle:
```
alembic current
```

Pour obtenir l'historique des migrations:
```
alembic history
```