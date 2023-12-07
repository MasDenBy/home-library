using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasDen.HomeLibrary.Infrastructure.Processors.OpenLibrary;
public class OpenLibraryProcessor
{
	private readonly HttpClient httpClient;

	public OpenLibraryProcessor(HttpClient httpClient)
	{
		this.httpClient = httpClient;
	}


}
