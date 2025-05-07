const db = require("../config/db");

class VendedorModel {
  static async listarTodos() {
    try {
      const [rows] = await db.query("CALL sp_lisven()");
      if (!rows || !rows[0]) {
        return [];
      }
      return rows[0].map(vendedor => ({
        id_ven: vendedor.id_ven,
        nom_ven: vendedor.nom_ven || '',
        ape_ven: vendedor.ape_ven || '',
        cel_ven: vendedor.cel_ven || '',
        distrito: vendedor.distrito || 'Sin distrito'
      }));
    } catch (error) {
      console.error("Error en listarTodos:", error);
      throw error;
    }
  }

  static async buscarPor(busqueda, tipo) {
    try {
      let rows;
      switch (tipo) {
        case "id":
          [rows] = await db.query("CALL sp_busven(?)", [busqueda]);
          break;
        case "nombre":
        case "apellido":
          [rows] = await db.query("CALL sp_searchven(?)", [busqueda]);
          break;
        default:
          [rows] = await db.query("CALL sp_lisven()");
      }
      return rows[0] || [];
    } catch (error) {
      console.error("Error en buscarPor:", error);
      throw error;
    }
  }

  static async listarDistritos() {
    try {
      const [rows] = await db.query("CALL sp_lisdistritos()");
      return rows[0];
    } catch (error) {
      console.error("Error en listarDistritos:", error);
      throw error;
    }
  }

  static async listarCafes() {
    const [rows] = await db.query("CALL sp_listartiposcafe()");
    return rows[0];
  }

  static async buscarPorId(id) {
    try {
      const [rows] = await db.query("CALL sp_busven(?)", [id]);
      return rows[0] || [];
    } catch (error) {
      console.error("Error en buscarPorId:", error);
      throw error;
    }
  }

  static async crear(nom_ven, ape_ven, cel_ven, id_distrito) {
    try {
      const [result] = await db.query("CALL sp_ingven(?, ?, ?, ?)", [
        nom_ven,
        ape_ven,
        cel_ven,
        id_distrito
      ]);
      return result[0];
    } catch (error) {
      console.error("Error en crear:", error);
      throw error;
    }
  }

  static async actualizar(id_ven, nom_ven, ape_ven, cel_ven, id_distrito) {
    try {
      await db.query("CALL sp_modven(?, ?, ?, ?, ?)", [
        id_ven,
        nom_ven,
        ape_ven,
        cel_ven,
        id_distrito
      ]);
    } catch (error) {
      console.error("Error en actualizar:", error);
      throw error;
    }
  }

  static async listarPaginado(limite, offset) {
    try {
      const [rows] = await db.query("CALL sp_lisven_paginado(?, ?)", [limite, offset]);
      return rows[0];
    } catch (error) {
      console.error("Error en listarPaginado:", error);
      throw error;
    }
  }

  static async contarTodos() {
    try {
      const [rows] = await db.query("SELECT COUNT(*) as total FROM Vendedor");
      return rows[0].total;
    } catch (error) {
      console.error("Error en contarTodos:", error);
      throw error;
    }
  }

  static async buscarPorPaginado(busqueda, tipo, limite, offset) {
    let rows;
    try {
      switch (tipo) {
        case "id":
          [rows] = await db.query("CALL sp_busven_paginado(?, ?, ?)", [busqueda, limite, offset]);
          break;
        case "nombre":
        case "apellido":
          [rows] = await db.query("CALL sp_searchven_paginado(?, ?, ?)", [busqueda, limite, offset]);
          break;
        default:
          return await this.listarPaginado(limite, offset);
      }
      return rows[0] || [];
    } catch (error) {
      console.error("Error en buscarPorPaginado:", error);
      return [];
    }
  }

  static async contarFiltrados(busqueda, tipo) {
    try {
      let sql;
      switch (tipo) {
        case "id":
          sql = "SELECT COUNT(*) as total FROM Vendedor WHERE id_ven = ?";
          break;
        case "nombre":
          sql = "SELECT COUNT(*) as total FROM Vendedor WHERE nom_ven LIKE ?";
          busqueda = `%${busqueda}%`;
          break;
        case "apellido":
          sql = "SELECT COUNT(*) as total FROM Vendedor WHERE ape_ven LIKE ?";
          busqueda = `%${busqueda}%`;
          break;
        default:
          return await this.contarTodos();
      }
      const [rows] = await db.query(sql, [busqueda]);
      return rows[0].total;
    } catch (error) {
      console.error("Error en contarFiltrados:", error);
      return 0;
    }
  }

  static async eliminar(id_ven) {
    try {
      await db.query("CALL sp_delven(?)", [id_ven]);
    } catch (error) {
      console.error("Error en eliminar:", error);
      throw error;
    }
  }
}

module.exports = VendedorModel;
