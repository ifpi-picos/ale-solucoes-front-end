import './styles.css';
function Home() {
  return (
    <div className="home">
      <div className="header">
        <div className="logo" onClick={() => window.location.href = "/"}></div>
        <div className="menu"> 
        <button className="btn-sign-in" onClick={() => window.location.href = "/login"}>Login</button>
        <button className="btn-sign-up" onClick={() => window.location.href = "/cadastro"}>Cadastro</button>
        </div> 
      </div>
      <div className="body">
        <div className='body-left'>
          <div className='body-title'>Bem-vindo!</div>
          <div className='body-text'>
            Orçametro é a maneira fácil e rápida de criar orçamentos personalizados em minutos. Adicione os itens do orçamento, incluindo o tamanho em metros e o valor por metro, e nosso sistema calculará automaticamente o custo total. Envie seus orçamentos diretamente do site para seus clientes e economize tempo e esforço na criação de orçamentos.
            <br></br>
            <br></br>
            Experimente agora mesmo o Orçametro e veja como podemos ajudá-lo a criar orçamentos profissionais e precisos em questão de minutos.
          </div>
        </div>
        <div className='body-right'></div>
      </div>
      <div className="footer">Desenvolvido por ALE Soluções | Copyright &copy; 2023</div>
    </div>
  );
}

export default Home;