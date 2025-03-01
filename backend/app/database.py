import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Configuration de la base de données
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "root")
DB_NAME = os.getenv("DB_NAME", "twool")

DATABASE_URL = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:8889/{DB_NAME}"

# Créer un moteur SQLAlchemy
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=False
)

# Créer une session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Créer une session scopée
db_session = scoped_session(SessionLocal)

# Pour la compatibilité avec le code existant
class Database:
    def __init__(self, host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASSWORD):
        self.host = host
        self.database = database
        self.user = user
        self.password = password
        self.session = None
    
    def connect(self):
        try:
            self.session = SessionLocal()
            return True
        except Exception as e:
            print(f"Error while connecting to MySQL: {e}")
            return False
    
    def disconnect(self):
        if self.session:
            self.session.close()
    
    def execute_query(self, query, params=None):
        """
        Méthode compatible avec l'ancien code, mais utilisant SQLAlchemy
        Note: Cette méthode est fournie pour la compatibilité, mais il est 
        recommandé d'utiliser directement l'ORM pour les nouvelles fonctionnalités.
        """
        try:
            if not self.session:
                self.connect()
            
            from sqlalchemy import text
            
            if query.lower().startswith("select"):
                result = self.session.execute(text(query), params if params else {})
                rows = [dict(row._mapping) for row in result]
                return rows
            else:
                result = self.session.execute(text(query), params if params else {})
                self.session.commit()
                return result.rowcount
        except Exception as e:
            self.session.rollback()
            print(f"Error executing query: {e}")
            return None

# Dépendance pour obtenir la session de base de données
def get_db():
    db = db_session()
    try:
        yield db
    finally:
        db.close()