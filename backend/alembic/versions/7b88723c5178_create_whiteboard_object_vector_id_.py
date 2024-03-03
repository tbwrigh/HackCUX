"""create_whiteboard_object_vector_id_mappings

Revision ID: 7b88723c5178
Revises: 3dd7c5353b75
Create Date: 2024-03-02 17:54:26.721828

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7b88723c5178'
down_revision: Union[str, None] = '3dd7c5353b75'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'whiteboard_object_vector_id_mappings',
        sa.Column('id', sa.Integer, nullable=False),
        sa.Column('whiteboard_object_id', sa.Integer, sa.ForeignKey("whiteboard_objects.id", ondelete="CASCADE"), nullable=False),
    )


def downgrade() -> None:
    op.drop_table('whiteboard_object_vector_id_mappings')
