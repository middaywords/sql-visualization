package hello;

import hello.gen2.hello.*;

public class SimpleSqlVisitor extends SqlBaseBaseVisitor {

    @Override
    public String visitFromClause(SqlBaseParser.FromClauseContext ctx) {
        String tableName = visitRelation(ctx.relation(0));
        System.out.println("SQL table name: " + tableName);
        return tableName;
    }

    @Override
    public String visitRelation(SqlBaseParser.RelationContext ctx) {
        if (ctx.relationPrimary() instanceof SqlBaseParser.TableNameContext) {
            return visitTableName((SqlBaseParser.TableNameContext)ctx.relationPrimary());
        }
        return "";
    }

    @Override
    public String visitTableName(SqlBaseParser.TableNameContext ctx) {
        return visitTableIdentifier(ctx.tableIdentifier());
    }

    @Override
    public String visitTableIdentifier(SqlBaseParser.TableIdentifierContext ctx) {
        return ctx.getChild(0).getText();
    }

}
