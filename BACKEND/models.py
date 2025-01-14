from sqlalchemy import ForeignKey, Integer, MetaData, String
from sqlalchemy.orm import Mapped, declarative_base, mapped_column, relationship
naming_convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}
metadata = MetaData(naming_convention=naming_convention)
Base = declarative_base(metadata=metadata)

class BaseUser(Base):
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50))
    password: Mapped[str] = mapped_column(String(500))

class BaseUserModel(Base):
    __tablename__ = "usermodel"
    items: Mapped[str] = mapped_column(String(5000), default="")
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("user.id"))
    user = relationship("User", back_populates="usermodel")

class BaseProblem(Base):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(50))
    description: Mapped[str] = mapped_column(String(5000))



    